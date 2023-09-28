import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { dirname } from 'path';
import { mockDiscoveryPool } from './mock-discovery-pool';

const ports = process.env.Port || 3000;
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${dirname(__dirname)}/src/uploads/`);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const fileName = file.originalname.split('.')[0];
    cb(null, `${fileName}.${ext}`);
  },
});
const upload = multer({ storage: storage });

// cors settings
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

// create express app
const app = express();

// set cors
app.use(cors(corsOptions));

// set router
app.use('/', router);

// router post
router.post('/test', express.json(), (req, res, next) => {
  console.log(req.body);
  res.send(JSON.stringify(req.body));
})

// Receive FormData
router.post('/upload', upload.single('upload_file'), (req, res, next) => {
  console.log(req.file, req.body);
  res.send({ result: 'success' });
})

router.get('/web/cloud/podview/filterDevice', (req, res) => {
  return res.status(200).send(mockDiscoveryPool)
})

// assign port
app.listen(ports, () => {
  console.log(`Server is listening on port ${ports}`);
});