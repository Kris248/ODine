import { Card, CardContent, Grid, Skeleton, Stack } from "@mui/material";

export function LoadingState() {
  return (
    <Stack spacing={3}>
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2.5}>
            <Skeleton variant="rounded" height={260} />
            <Skeleton variant="text" width="42%" height={58} />
            <Skeleton variant="text" width="64%" />
            <Stack direction="row" spacing={1}>
              <Skeleton variant="rounded" width={90} height={34} />
              <Skeleton variant="rounded" width={110} height={34} />
              <Skeleton variant="rounded" width={120} height={34} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2}>
            <Skeleton variant="rounded" height={56} />
            <Stack direction="row" spacing={1}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" width={110} height={40} />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid key={index} item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Skeleton variant="rounded" height={180} />
                  <Skeleton variant="text" width="58%" height={34} />
                  <Skeleton variant="text" width="92%" />
                  <Skeleton variant="text" width="74%" />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Skeleton variant="text" width={90} />
                    <Skeleton variant="rounded" width={120} height={42} />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
