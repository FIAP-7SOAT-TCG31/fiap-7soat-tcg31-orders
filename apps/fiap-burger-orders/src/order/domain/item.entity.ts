import { Entity } from '@fiap-burger/tactical-design/core';
import { ItemTypes } from './values/item-type.value';

export class Item extends Entity {
  constructor(
    protected readonly _id: string,
    private _name: string,
    private _price: number,
    private _type: ItemTypes,
    private _description: string,
    private _images: string[] = [],
  ) {
    super(_id);
    if (_images?.length) {
      this._images = _images.map((x) => x);
    }
  }

  get name() {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get type() {
    return this._type;
  }

  set type(value: ItemTypes) {
    this._type = value;
  }

  get price() {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
  }

  get description() {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get images() {
    return this._images.map((x) => x);
  }

  addImage(image: string) {
    this._images.push(image);
  }

  removeImage(image: string) {
    this._images = this._images.filter((x) => x !== image);
  }
}
