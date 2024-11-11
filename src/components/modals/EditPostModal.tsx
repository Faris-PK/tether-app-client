import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { MapPin, Calendar, Image as ImageIcon } from 'lucide-react';
import moment from 'moment';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    _id: string;
    caption: string;
    location?: string;
    createdAt: string;
    mediaUrl?: string;
    postType: string;
  };
  onSave: (postId: string, caption: string, location: string) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, onClose, post, onSave }) => {
  const [caption, setCaption] = useState(post.caption);
  const [location, setLocation] = useState(post.location || '');

  const handleSave = () => {
    onSave(post._id, caption, location);
    onClose();
  };

  return (
    <Modal 
      open={isOpen} 
      onClose={onClose}
      aria-labelledby="edit-post-modal"
      aria-describedby="modal-to-edit-post"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 600,
        bgcolor: '#010F18',
        border: '1px solid #1B2730',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px',
        color: 'white',
      }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2, color: 'white' }}>
          Edit Post
        </Typography>

        {post.postType !== 'note' && post.mediaUrl && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            {post.postType === 'image' ? (
              <img 
                src={post.mediaUrl} 
                alt="Post content" 
                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
              />
            ) : (
              <Box sx={{ 
                width: '100%', 
                height: '200px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#1B2730',
                borderRadius: '8px'
              }}>
                <ImageIcon size={64} color="#4B5563" />
              </Box>
            )}
          </Box>
        )}

        <TextField
          fullWidth
          label="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: '#1B2730',
              },
              '&:hover fieldset': {
                borderColor: '#3B82F6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3B82F6',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#9CA3AF',
            },
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MapPin size={20} color="#9CA3AF" />
          <TextField
            fullWidth
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            margin="normal"
            variant="outlined"
            sx={{
              ml: 1,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: '#1B2730',
                },
                '&:hover fieldset': {
                  borderColor: '#3B82F6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3B82F6',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#9CA3AF',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Calendar size={20} color="#9CA3AF" />
          <Typography variant="body2" sx={{ ml: 1, color: '#9CA3AF' }}>
            Created {moment(post.createdAt).format('MMMM D, YYYY')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            onClick={onClose} 
            sx={{ 
              mr: 2, 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            sx={{
              backgroundColor: '#3B82F6',
              '&:hover': {
                backgroundColor: '#2563EB',
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditPostModal;