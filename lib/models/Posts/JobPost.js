import Post from "./Post";

class JobPost extends Post {
  constructor(data) {
    super(data);
    this.job_type = data.details?.job_type;
    this.salary = data.details?.salary;
    this.location = data.details?.location;
    this.position = data.details?.position;
  }
}

export default JobPost;