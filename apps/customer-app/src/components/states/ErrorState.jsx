import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";

export function ErrorState({ title, description, actionLabel, onAction }) {
  return (
    <Card sx={{ p: { xs: 1, sm: 2 } }}>
      <CardContent>
        <Stack spacing={2} alignItems="center" textAlign="center" sx={{ py: { xs: 4, md: 6 } }}>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              bgcolor: "rgba(155, 91, 61, 0.12)",
              color: "primary.main"
            }}
          >
            <ErrorOutlineRoundedIcon sx={{ fontSize: 38 }} />
          </Stack>
          <Typography variant="h4">{title}</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 480 }}>
            {description}
          </Typography>
          {actionLabel ? (
            <Button variant="contained" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
