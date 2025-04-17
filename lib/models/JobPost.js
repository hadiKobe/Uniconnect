import Post from "./Post";

class JobPost extends Post {
  constructor(data) {
    super(data);
    this.job_type = data.job_type;
    this.salary = data.salary;
    this.location = data.location;
  }
}

export default JobPost;