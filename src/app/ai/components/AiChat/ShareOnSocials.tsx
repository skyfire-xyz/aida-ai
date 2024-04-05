import React, { useState } from 'react';

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import ShareIcon from '@mui/icons-material/Share';
import TwitterIcon from '@mui/icons-material/Twitter';
import {
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from '@mui/material';

export default function ShareOnSocials() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        startIcon={<ShareIcon />}
      >
        Share Image
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="text-center text-gray-800">
          Share On
        </DialogTitle>
        <DialogContent className="flex justify-center space-x-4">
          <Tooltip title="Share on Twitter">
            <IconButton size="large" color="primary">
              <TwitterIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share on Instagram">
            <IconButton size="large" color="primary">
              <InstagramIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share on Facebook">
            <IconButton size="large" color="primary">
              <FacebookIcon />
            </IconButton>
          </Tooltip>
        </DialogContent>
      </Dialog>
    </div>
  );
}
