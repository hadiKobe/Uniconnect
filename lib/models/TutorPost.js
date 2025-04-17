import Post from "./Post";

class TutorPost extends Post {
  constructor(data) {
    super(data);
    this.subject = data.subject;
    this.rate = data.rate;
    this.location = data.location;
  }

}

export default TutorPost;
