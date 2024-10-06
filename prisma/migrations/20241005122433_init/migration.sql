-- DropIndex
DROP INDEX `Log_requestId_traceId_idx` ON `log`;

-- CreateIndex
CREATE INDEX `Log_requestId_idx` ON `Log`(`requestId`);

-- CreateIndex
CREATE INDEX `Log_traceId_idx` ON `Log`(`traceId`);

-- CreateIndex
CREATE INDEX `Log_spanId_idx` ON `Log`(`spanId`);

-- CreateIndex
CREATE INDEX `Log_parentSpanId_idx` ON `Log`(`parentSpanId`);
