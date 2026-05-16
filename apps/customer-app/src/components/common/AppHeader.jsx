import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import TableBarRoundedIcon from "@mui/icons-material/TableBarRounded";
import { Box, ButtonBase, Chip, Stack, Typography } from "@mui/material";

export function AppHeader({ title, subtitle, tableLabel, onBack, actions }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      sx={{ mb: { xs: 2, sm: 3 } }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
        {onBack ? (
          <ButtonBase
            onClick={onBack}
            aria-label="Go back"
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              boxShadow: "0 8px 24px rgba(17, 24, 39, 0.05)"
            }}
          >
            <ArrowBackRoundedIcon fontSize="small" />
          </ButtonBase>
        ) : null}

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" sx={{ lineHeight: 1.1 }} noWrap>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="flex-end"
        useFlexGap
        flexWrap="wrap"
      >
        {tableLabel ? (
          <Chip
            icon={<TableBarRoundedIcon />}
            label={tableLabel}
            variant="outlined"
            sx={{ bgcolor: "rgba(255,255,255,0.78)" }}
          />
        ) : null}
        {actions}
      </Stack>
    </Stack>
  );
}
