import Post from './Post.js';

class MarketPost extends Post {
  constructor(data) {
    super(data);
    this.price = data.details?.price ;
    this.location = data.details?.location;
    this.type = data.details?.type;
    this.product_name = data.details?.product_name;
  }
}

export default MarketPost;