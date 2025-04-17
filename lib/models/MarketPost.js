import Post from "./Post";

class MarketPost extends Post {
  constructor(data) {
    super(data);
    this.price = data.price;
    this.location = data.location;
  }
}

export default MarketPost;