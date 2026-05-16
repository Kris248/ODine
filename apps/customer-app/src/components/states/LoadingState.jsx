import { Box, Card, CardContent, Skeleton, Stack, Typography } from "@mui/material";

export function LoadingState({
  title = "Loading your table",
  description = "Fetching the menu, live order session, and all restaurant details."
}) {
  return (
    <Box sx={{ display: "grid", placeItems: "center", minHeight: "68vh", py: 4 }}>
      <Card sx={{ width: "100%", maxWidth: 840 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack spacing={2.25}>
            <Stack spacing={1}>
              <Skeleton variant="rounded" width="36%" height={32} />
              <Skeleton variant="rounded" width="72%" height={20} />
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Stack>
            <Stack spacing={1.25}>
              <Skeleton variant="rounded" height={184} />
              <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
                <Skeleton variant="rounded" width={112} height={38} />
                <Skeleton variant="rounded" width={112} height={38} />
                <Skeleton variant="rounded" width={132} height={38} />
              </Stack>
              <Skeleton variant="rounded" height={78} />
              <Skeleton variant="rounded" height={78} />
              <Skeleton variant="rounded" height={78} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
