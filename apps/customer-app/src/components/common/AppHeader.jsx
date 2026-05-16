import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import TableBarRoundedIcon from "@mui/icons-material/TableBarRounded";
import { Box, IconButton, Stack, Typography } from "@mui/material";

export function AppHeader({ title, subtitle, tableLabel, onBack }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{ mb: 3 }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        {onBack ? (
          <IconButton
            onClick={onBack}
            aria-label="Go back"
            sx={{
              bgcolor: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(121, 88, 71, 0.08)"
            }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>
        ) : null}
        <Box>
          <Typography variant="h5">{title}</Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      </Stack>
      {tableLabel ? (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: 99,
            bgcolor: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(121, 88, 71, 0.1)"
          }}
        >
          <TableBarRoundedIcon sx={{ fontSize: 18, color: "secondary.main" }} />
          <Typography variant="body2" fontWeight={700}>
            {tableLabel}
          </Typography>
        </Stack>
      ) : null}
    </Stack>
  );
}
