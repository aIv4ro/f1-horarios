import { fetchNextRace } from './scripts/services/fetchNextRace.js';
import { timeOptions, dateOptions } from './scripts/dateOptions.js';

const $ = selector => document.querySelector(selector);
const $article = $('.gp')

fetchNextRace().then(race => renderGp(race));

function getSessionsFromGp(gp) {
  const {
    FirstPractice: fp1, 
    SecondPractice: fp2, 
    ThirdPractice: fp3,
    Sprint: sprintRace, 
    Qualifying: quali,
    date, time, fullDate
  } = gp;

  const sessions = [
    {...fp1, fullDate: new Date(`${fp1.date} ${fp1.time}`), name: 'FP1'}, 
    {...fp2, fullDate: new Date(`${fp2.date} ${fp2.time}`), name: 'FP2'},
    {...quali, fullDate: new Date(`${quali.date} ${quali.time}`), name: 'Quali'},
    {date, time, fullDate, name: 'Race'}
  ]

  if(fp3) {
    sessions.push(
      {...fp3, fullDate: new Date(`${fp3.date} ${fp3.time}`), name: 'FP3'}, 
    )
  }

  if(sprintRace) {
    sessions.push(
      {...sprintRace, fullDate: new Date(`${sprintRace.date} ${sprintRace.time}`), name: 'Sprint Race'}, 
    )
  }

  return sessions.sort((a, b) => {
    if(a.fullDate > b.fullDate) {
      return 1
    }

    if(a.fullDate < b.fullDate) {
      return -1
    }

    return 0
  });
}

function renderGp(gp) {
  const {raceName, Circuit: { circuitName }} = gp;
  
  const sessions = getSessionsFromGp(gp);

  const groupedSessions = sessions.reduce((groups, session) => {
    const {date: sessionDate} = session

    groups[sessionDate] ??= [];
    groups[sessionDate].push(session);

    return groups;
  }, {});

  $article.innerHTML = `
    <h2>${raceName}</h2>
    <h3>${circuitName}</h3>
    <ul class="sessions">
      ${
        Object.entries(groupedSessions).map(([date, sessions]) => {
          const day = new Date(date);

          return `
            <li>
              ${day.toLocaleDateString(undefined, dateOptions)}
              <ul class="session-group">
                ${
                  sessions.map(({name, time, fullDate}) => {
                    const sessionDate = new Date(fullDate);
                    return `<li>${name}: ${sessionDate.toLocaleTimeString(undefined, timeOptions)}</li>`;
                  }).join(' ')
                }
              </ul>
            </li>
          `
        }).join('\n')
      }
    </ul>
  `
}