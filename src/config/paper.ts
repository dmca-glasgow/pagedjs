export type Paper = {
  selectedSize: Size,
  sizes: Sizes
}

export enum Size {
  A4 = 'A4',
  Letter = 'Letter',
  Legal = 'Legal'
}

type Dimensions = {
  width: string,
  height: string,
}

type Sizes = Record<Size, Dimensions>
