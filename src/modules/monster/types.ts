export interface IMonster {
  name: string;
  code: string;
  level: number;
  type: string;
  hp: number;
  attack_fire: number;
  attack_earth: number;
  attack_water: number;
  attack_air: number;
  res_fire: number;
  res_earth: number;
  res_water: number;
  res_air: number;
  critical_strike: number;
  initiative: number;
  effects: [];
  min_gold: number;
  max_gold: number;
  drops: IDropMonster[];
}

export interface IDropMonster {
  code: string;
  rate: number;
  min_quantity: number;
  max_quantity: number;
}
