import { Item } from './item.entity';

describe('Item', () => {
  const id = '123';
  const name = 'XBurger';
  const price = 12.99;
  const description = 'Dummy';
  const images = ['anyurl.com'];

  it('should instantiate without images', () => {
    const target = new Item(id, name, price, 'Dessert', description);
    expect(target).toBeInstanceOf(Item);
  });

  it('should instantiate with images', () => {
    const target = new Item(id, name, price, 'Dessert', description, images);
    expect(target).toBeInstanceOf(Item);
    expect(target.images).toEqual(expect.arrayContaining(images));
  });

  it('should add new image', () => {
    const target = new Item(id, name, price, 'Dessert', description, images);
    const imageURL = 'otherUrl.com';
    target.addImage(imageURL);
    expect(target.images).toEqual(
      expect.arrayContaining([...images, imageURL]),
    );
  });

  it('should remove image', () => {
    const target = new Item(id, name, price, 'Dessert', description, images);
    const imageURL = 'otherUrl.com';
    target.addImage(imageURL);
    target.removeImage(imageURL);
    expect(target.images).toEqual(expect.arrayContaining(images));
    expect(target.images).toHaveLength(1);
  });
});
