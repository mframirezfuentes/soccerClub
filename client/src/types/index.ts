export interface Team {
  id: string;
  name: string;
  country: string;
  city: string;
  stadium: string;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  position: string;
  country: string;
  teamIds: string[];
}

export type TeamFormData = Omit<Team, 'id'>;
export type PlayerFormData = Omit<Player, 'id' | 'teamIds'> & { teamId?: string };
