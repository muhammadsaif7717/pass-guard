type UserData = {
  email: string;
  username: string;
};

export type PasswordsData = {
  _id?: string;
  createdAt: string;
  user: UserData;
  website: string;
  name: string;
  username: string;
  password: string;
  note?: string;
};

export type CardsData = {
  _id?: string;
  createdAt: string;
  user: UserData;
  name: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  note?: string;
};
