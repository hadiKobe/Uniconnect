import Post from './Post.js';

class MarketPost extends Post {
  constructor(data) {
    super(data);
    this.price = data.details?.price ;
    this.location = data.details?.location ;
  }
}

export default MarketPost;