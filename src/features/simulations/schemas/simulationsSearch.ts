import { z } from "zod";

import { zReportStatus } from "@/lib/api";

export const simulationsSearchSchema = z.object({
  search: z.string().optional(),
  reportStatus: zReportStatus.optional(),
  showArchived: z.literal(true).optional(),
});
