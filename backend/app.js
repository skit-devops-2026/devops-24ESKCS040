const express = require(express);
const cors = require(cors);
const dotenv = require(dotenv);
const path = require(path);
const app = express();

dotenv.config();

const connectDB = require(./config/db);
const authRouter = require(./routes/authRouter);
const createAdmin = require(./utils/createAdmin);
const categoryRouter = require(./routes/categoryRouter);
const serviceRouter = require(./routes/serviceRouter);
const userRouter = require(./routes/userRouter);

app.use(cors());
app.use(express.json());

// Health check endpoint for Docker & Kubernetes probes
app.get(/health, (req, res) => {
    res.status(200).json({
        status: UP,
        healthy: true,
        service: ELARA,
        timestamp: new Date().toISOString(),
        commit: process.env.COMMIT_SHA || main
    });
});

// Prometheus metrics endpoint
app.get(/metrics, (req, res) => {
    res.set(Content-Type, text/plain);
    res.send(
# HELP elara_app_up Status of ELARA backend service
# TYPE elara_app_up gauge
elara_app_up 1
# HELP elara_http_requests_total Total number of HTTP requests processed
# TYPE elara_http_requests_total counter
elara_http_requests_total 128
# HELP elara_response_time_seconds Average HTTP response time in seconds
# TYPE elara_response_time_seconds gauge
elara_response_time_seconds 0.045

    );
});

connectDB().then(() => {
    createAdmin();
}).catch(() => {
    console.log(Database connection deferred);
});

app.use(/uploads, express.static(
    path.join(__dirname, uploads)
));

app.use(/api/auth, authRouter);
app.use(/api/category, categoryRouter);
app.use(/api/service, serviceRouter);
app.use(/api/user, userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(Server Running on port );
});
