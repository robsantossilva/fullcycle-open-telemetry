const opentelemetry = require("@opentelemetry/api");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const {
  ConsoleSpanExporter,
  BatchSpanProcessor,
} = require("@opentelemetry/sdk-trace-base");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");

// Optionally register instrumentation libraries
registerInstrumentations({
  instrumentations: [getNodeAutoInstrumentations()],
});

const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "otel-node-app",
    [SemanticResourceAttributes.SERVICE_VERSION]: "0.1.0",
  })
);

const provider = new NodeTracerProvider({
  resource: resource,
});

const processor = new BatchSpanProcessor(new ConsoleSpanExporter());
provider.addSpanProcessor(processor);

const zipkinExporter = new ZipkinExporter({
  url: "http://localhost:9411/api/v2/spans",
  //serviceName: "course-service",
});
provider.addSpanProcessor(new BatchSpanProcessor(zipkinExporter));

provider.register();
