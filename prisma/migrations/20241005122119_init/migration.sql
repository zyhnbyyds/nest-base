-- CreateIndex
CREATE INDEX `Log_requestId_traceId_idx` ON `Log`(`requestId`, `traceId`);
