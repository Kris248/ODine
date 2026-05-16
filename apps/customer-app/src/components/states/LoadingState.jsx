import { Box, Card, CardContent, Skeleton, Stack, Typography } from "@mui/material";

export function LoadingState({ title = "Loading your table", description = "Fetching the menu, offers, and your live dining session." }) {
  return (
    <Box sx={{ display: "grid", placeItems: "center", minHeight: "68vh", py: 4 }}>
      <Card sx={{ width: "100%", maxWidth: 760 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack spacing={2.25}>
            <Stack spacing={1}>
              <Skeleton variant="rounded" width="40%" height={32} />
              <Skeleton variant="rounded" width="75%" height={22} />
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Skeleton variant="rounded" height={180} />
              <Stack direction="row" spacing={1.25}>
                <Skeleton variant="rounded" width={110} height={38} />
                <Skeleton variant="rounded" width={110} height={38} />
                <Skeleton variant="rounded" width={110} height={38} />
              </Stack>
              <Stack spacing={1.25}>
                <Skeleton variant="rounded" height={86} />
                <Skeleton variant="rounded" height={86} />
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
