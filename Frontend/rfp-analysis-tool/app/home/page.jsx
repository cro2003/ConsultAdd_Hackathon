// app/page.jsx
"use client";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Alert,
  Container,
  Grid,
} from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 4,
      }}
    >
      {/* Homepage Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Section - Description */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
              Talent Partner for Staffing Firms
            </Typography>
            <Typography variant="body1" paragraph>
              Start recruiting from a strong source. Hire top-tier, pre-screened
              tech talent on contract for your clients.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href="#rfp-dashboard"
              sx={{ marginRight: 2 }}
            >
              View RFP Dashboard
            </Button>
            <Button variant="outlined" color="primary">
              Contact Us
            </Button>
          </Grid>

          {/* Right Section - Illustration */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <img
                src="/assets/company-logo.png"
                alt="Company Logo"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* RFP Dashboard Section */}
      <Box id="rfp-dashboard" sx={{ marginTop: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          📌 Sample RFP Requirements
        </Typography>

        {/* Compliance Report */}
        <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
          <Typography variant="h5" gutterBottom>
            1. Eligibility Verification (RAG-Based Check)
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Requirement</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>SAM.gov Registration</TableCell>
                  <TableCell>✅ PASS</TableCell>
                  <TableCell>
                    Registered since 03/01/2022 (CAGE: 8J4T7).
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Texas Employment License</TableCell>
                  <TableCell>✅ PASS</TableCell>
                  <TableCell>Valid license #TXEA-34892.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>HUB/DBE Certification</TableCell>
                  <TableCell>❌ FAIL</TableCell>
                  <TableCell>
                    Not certified. (Non-critical but reduces scoring priority.)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Alert severity="info" sx={{ marginTop: 2 }}>
            Eligible to bid but may lose preference points without HUB/DBE
            status. Consider partnering with a certified subcontractor.
          </Alert>
        </Paper>

        {/* Submission Checklist */}
        <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
          <Typography variant="h5" gutterBottom>
            2. Submission Checklist (Auto-Generated)
          </Typography>
          <ul>
            <li>W-9 Form ✅ (Attached, TIN: 47-6392011)</li>
            <li>Certificate of Insurance ✅ (Travelers Policy #TX-884529-A)</li>
            <li>SF-33 Form ❌ (Missing! Download here)</li>
          </ul>
          <Alert severity="warning" sx={{ marginTop: 2 }}>
            Urgent: SF-33 form is required. Assign to ‘Contracts Team’ with
            deadline reminder.
          </Alert>
        </Paper>

        {/* Contract Risk Analysis */}
        <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
          <Typography variant="h5" gutterBottom>
            3. Contract Risk Analysis (Legal NLP)
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Clause</TableCell>
                  <TableCell>Risk Level</TableCell>
                  <TableCell>Suggestion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>90-Day Termination</TableCell>
                  <TableCell>⚠️ Medium</TableCell>
                  <TableCell>Negotiate for 30-day notice period.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Net 45 Payment</TableCell>
                  <TableCell>⚠️ Medium</TableCell>
                  <TableCell>
                    Standard is Net 30; flag for Finance review.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Call-to-Action Buttons */}
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <Button variant="contained" color="primary" sx={{ marginRight: 2 }}>
            Assign SF-33
          </Button>
          <Button variant="outlined" color="primary">
            Legal Review
          </Button>

          <Button>
            
          </Button>
        </Box>
      </Box>
    </Box>
  );
}