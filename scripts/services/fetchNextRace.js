export function fetchNextRace() {
  return fetch('https://ergast.com/api/f1/current.json')
  .then(res => res.json())
  .then(res => {
    const { Races: races } = res.MRData.RaceTable;
    const now = new Date();

    return races.filter(race => {
      const {date: day, time} = race;
      const date = new Date(`${day} ${time}`);  
      race.fullDate = date;  
      
      return now.toISOString() < date.toISOString();
    }).at(0);
  });
}