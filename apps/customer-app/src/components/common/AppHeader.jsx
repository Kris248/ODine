import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Box, ButtonBase, Chip, Stack, Typography, useTheme } from "@mui/material";

export function AppHeader({ title, subtitle, tableLabel, onBack, actions, eyebrow }) {
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={1.5}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", md: "center" }}
      sx={{
        mb: { xs: 2, md: 2.75 },
        py: 0.25
      }}
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
              bgcolor: "rgba(255,255,255,0.9)",
              boxShadow: theme.shadows[2],
              transition: "transform 0.16s ease, box-shadow 0.16s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <ArrowBackRoundedIcon fontSize="small" />
          </ButtonBase>
        ) : null}

        <Box sx={{ minWidth: 0 }}>
          {eyebrow ? (
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.35 }}>
              {eyebrow}
            </Typography>
          ) : null}
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: 26, sm: 32, md: 36 },
              lineHeight: 1.1
            }}
            noWrap={false}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
                maxWidth: 760
              }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
        {tableLabel ? (
          <Chip
            label={tableLabel}
            sx={{
              bgcolor: "rgba(15,118,110,0.08)",
              color: "primary.main",
              border: "1px solid rgba(15,118,110,0.14)",
              fontWeight: 800
            }}
          />
        ) : null}
        {actions}
      </Stack>
    </Stack>
  );
}
