import Post from './Post.js';

class MarketPost extends Post {
  constructor(data) {
    super(data);
    this.price = data.price;
    this.location = data.location;
  }
}

export default MarketPost;