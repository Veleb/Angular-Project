import util from 'util';
import jwt from 'jsonwebtoken';

const verify = util.promisify(jwt.verify);
const sign = util.promisify(jwt.sign);
const decode = jwt.decode;

const jwtp = {
  verify,
  sign,
  decode
}

export default jwtp;