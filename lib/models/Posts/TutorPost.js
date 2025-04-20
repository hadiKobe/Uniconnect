import Post from "./Post";

class TutorPost extends Post {
  constructor(data) {
    super(data);
    this.subject = data.details?.subject;
    this.rate = data.details?.rate;
    this.location = data.details?.location;
  }

}

export default TutorPost;
