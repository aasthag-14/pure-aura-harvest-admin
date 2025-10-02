export type Collection = {
  _id?: string;
  id: string; // slug e.g. "car-accessories"
  title: string;
  description: string;
};

export type CollectionInput = {
  id: string;
  title: string;
  description: string;
};

