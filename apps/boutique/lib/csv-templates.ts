// Dynamic CSV Templates for Different Store Types
export const CSV_TEMPLATES = {
  boutique: {
    fileName: 'boutique-products-template.csv',
    headers: [
      'productName',
      'description', 
      'category',
      'price',
      'stock',
      'sku',
      'size',
      'color', 
      'fabric',
      'imageName'
    ],
    required: [
      'productName',
      'description',
      'category', 
      'price',
      'stock',
      'imageName'
    ],
    attributesMapping: {
      size: 'size',
      color: 'color',
      fabric: 'fabric',
      sku: 'sku'
    },
    displayName: 'Boutique (Dress Shop)'
  },
  jewellery: {
    fileName: 'jewellery-products-template.csv',
    headers: [
      'productName',
      'description',
      'category', 
      'price',
      'stock',
      'sku',
      'weight',
      'metalType',
      'purity', 
      'makingCharges',
      'imageName'
    ],
    required: [
      'productName',
      'description',
      'category',
      'price', 
      'stock',
      'weight',
      'metalType',
      'imageName'
    ],
    attributesMapping: {
      weight: 'weight',
      metalType: 'metalType',
      purity: 'purity',
      makingCharges: 'makingCharges',
      sku: 'sku'
    },
    displayName: 'Jewellery Shop'
  },
  sasthik: {
    fileName: 'sasthik-products-template.csv',
    headers: [
      'productName',
      'description',
      'category',
      'price',
      'stock',
      'sku',
      'size',
      'color',
      'material',
      'imageName'
    ],
    required: [
      'productName',
      'description',
      'category',
      'price',
      'stock',
      'imageName'
    ],
    attributesMapping: {
      size: 'size',
      color: 'color',
      material: 'material',
      sku: 'sku'
    },
    displayName: 'Sasthik Shop'
  },
  sashti: {
    fileName: 'sashti-products-template.csv',
    headers: [
      'productName',
      'description',
      'category', 
      'price',
      'stock',
      'imageName'
    ],
    required: [
      'productName',
      'description',
      'category',
      'price', 
      'stock',
      'imageName'
    ],
    attributesMapping: {
      sku: 'sku'
    },
    displayName: 'Sashti Sparkle'
  },
  tamilsmakeover: {
    fileName: 'tamilsmakeover-products-template.csv',
    headers: [
      'productName',
      'description',
      'category',
      'price',
      'stock',
      'sku',
      'serviceType',
      'duration',
      'imageName'
    ],
    required: [
      'productName',
      'description',
      'category',
      'price',
      'stock',
      'serviceType',
      'imageName'
    ],
    attributesMapping: {
      serviceType: 'serviceType',
      duration: 'duration',
      sku: 'sku'
    },
    displayName: 'Tamilsmakeover Service'
  }
};

export type StoreType = keyof typeof CSV_TEMPLATES;

export interface CSVTemplate {
  fileName: string;
  headers: string[];
  required: string[];
  attributesMapping: Record<string, string>;
  displayName: string;
}

export const getCSVTemplate = (storeType: StoreType): CSVTemplate => {
  return CSV_TEMPLATES[storeType];
};

export const getAllowedStoreTypes = (): StoreType[] => {
  return Object.keys(CSV_TEMPLATES) as StoreType[];
};