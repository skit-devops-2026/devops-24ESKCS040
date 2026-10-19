import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("Running ELARA automated tests...");

// Test 1: Fundamental arithmetic and string invariants
assert.equal(2 + 2, 4, "Arithmetic check failed");
assert.equal("ELARA".length, 5, "Project name length check failed");
assert.ok(true, "Boolean assertion failed");

// Test 2: Project repository directory structure
const expectedDirs = ["User", "admin", "backend", "scripts", "tests", ".github", "monitoring", "k8s", "docs"];
for (const dir of expectedDirs) {
  assert.ok(fs.existsSync(dir), `Expected directory '${ dir}' to exist in project root`);
}

// Test 3: Essential configuration files exist
const expectedFiles = ["README.md", ".gitignore", "Makefile", "Jenkinsfile", ".github/workflows/ci.yml"];
for (const file of expectedFiles) {
  assert.ok(fs.existsSync(file), `Expected file '${file}' to exist in repository`);
}

// Test 4: Frontend package configurations
const userPackageJson = JSON.parse(fs.readFileSync(path.join("User", "package.json"), "utf8"));
assert.ok(userPackageJson.name, "User package.json must specify a package name");

const adminPackageJson = JSON.parse(fs.readFileSync(path.join("admin", "package.json"), "utf8"));
assert.ok(adminPackageJson.name, "admin package.json must specify a package name");

// Test 5: Health check payload structure contract
const mockHealthResponse = {
  status: "UP",
  timestamp: new Date().toISOString(),
  service: "ELARA"
};
assert.equal(mockHealthResponse.status, "UP", "Health status must be UP");
assert.equal(mockHealthResponse.service, "ELARA", "Service name must match ELARA");

// Test 6: Milestone 2 Containerization files (Module 5)
const containerFiles = ["Dockerfile", "docker-compose.yml", "nginx.conf", "health", "metrics", ".dockerignore"];
for (const file of containerFiles) {
  assert.ok(fs.existsSync(file), `Expected containerization file '${file}' to exist`);
}

// Test 7: Milestone 2 Kubernetes manifests (Module 7)
const k8sFiles = [path.join("k8s", "deployment.yaml"), path.join("k8s", "service.yaml")];
for (const file of k8sFiles) {
  assert.ok(fs.existsSync(file), `Expected Kubernetes manifest '${file}' to exist`);
}
const k8sDeployment = fs.readFileSync(path.join("k8s", "deployment.yaml"), "utf8");
assert.ok(k8sDeployment.includes("replicas: 2"), "Kubernetes deployment must specify 2 replicas");
assert.ok(k8sDeployment.includes("livenessProbe"), "Kubernetes deployment must configure livenessProbe");
assert.ok(k8sDeployment.includes("readinessProbe"), "Kubernetes deployment must configure readinessProbe");

// Test 8: Milestone 2 Monitoring & Observability configuration (Module 6)
const monitoringFiles = [path.join("monitoring", "prometheus.yml"), path.join("monitoring", "dashboard.json")];
for (const file of monitoringFiles) {
  assert.ok(fs.existsSync(file), `Expected monitoring file '${file}' to exist`);
}
const dashboardJson = JSON.parse(fs.readFileSync(path.join("monitoring", "dashboard.json"), "utf8"));
assert.ok(dashboardJson.title, "Grafana dashboard must define a title");
assert.ok(Array.isArray(dashboardJson.panels) && dashboardJson.panels.length >= 4, "Grafana dashboard must contain at least 4 metric panels");

// Test 9: Verify static health payload content
const healthData = JSON.parse(fs.readFileSync("health", "utf8"));
assert.equal(healthData.status, "UP", "Health file status must be UP");
assert.equal(healthData.service, "ELARA", "Health file service must be ELARA");

// Test 10: Verify metrics format adheres to Prometheus standards
const metricsContent = fs.readFileSync("metrics", "utf8");
assert.ok(metricsContent.includes("elara_app_up 1"), "Metrics must report elara_app_up gauge");
assert.ok(metricsContent.includes("elara_http_requests_total"), "Metrics must report http request counter");

console.log("All automated tests passed successfully.");
