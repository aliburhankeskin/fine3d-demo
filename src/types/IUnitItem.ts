export interface IUnitItem {
  name: string;
  grossArea: number;
  netArea: number;
  virtualTourUrl: string | null;
  unitTypeId: number;
  unitNumber: number;
  image: {
    url: string;
    altText: string | null;
  };
  specifications: Array<{
    name: string;
    value: string;
    id: string;
  }>;
  facades: number[] | null;
  balconyImage: any | null;
  currentStateId: number | null;
  templateId: number;
  floor: {
    name: string;
    number: number;
    id: number;
  };
  block: {
    name: string;
    id: number;
  };
  stage: {
    name: string;
    id: number;
  };
  id: number;
}
