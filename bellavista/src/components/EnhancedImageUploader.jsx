import React, { useState, useRef, useCallback, useEffect } from 'react';

export const ImageCropper = ({ imageUrl, aspectRatio, onCropComplete, onCancel, allowSkip = false, onSkip }) => {
  const [cropMode, setCropMode] = useState('select'); // 'select', 'drag', 'resize'
  const [selection, setSelection] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDims, setImageDims] = useState({ naturalWidth: 0, naturalHeight: 0, clientWidth: 0, clientHeight: 0 });
  
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize with a default selection when image loads
  useEffect(() => {
    if (imageLoaded && imageDims.clientWidth > 0 && imageDims.clientHeight > 0) {
      // Create a centered 16:9 selection
      const containerWidth = imageDims.clientWidth;
      const containerHeight = imageDims.clientHeight;
      const targetRatio = aspectRatio;
      
      // Calculate optimal selection size (80% of container width)
      let selectionWidth = containerWidth * 0.8;
      let selectionHeight = selectionWidth / targetRatio;
      
      // If height is too big, scale down
      if (selectionHeight > containerHeight * 0.8) {
        selectionHeight = containerHeight * 0.8;
        selectionWidth = selectionHeight * targetRatio;
      }
      
      // Center the selection
      const centerX = (containerWidth - selectionWidth) / 2;
      const centerY = (containerHeight - selectionHeight) / 2;
      
      setSelection({
        x: centerX,
        y: centerY,
        width: selectionWidth,
        height: selectionHeight
      });
    }
  }, [imageLoaded, imageDims, aspectRatio]);

  const handleImageLoad = (e) => {
    const img = e.target;
    const rect = img.getBoundingClientRect();
    setImageDims({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      clientWidth: rect.width,
      clientHeight: rect.height
    });
    setImageLoaded(true);
  };

  const getMousePosition = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const constrainToAspectRatio = (x, y, width, height) => {
    if (aspectRatio && width > 0 && height > 0) {
      const currentRatio = width / height;
      if (currentRatio > aspectRatio) {
        // Too wide, reduce width
        width = height * aspectRatio;
      } else {
        // Too tall, reduce height
        height = width / aspectRatio;
      }
    }
    return { x, y, width, height };
  };

  const constrainToBounds = (x, y, width, height) => {
    const bounds = {
      minX: 0,
      minY: 0,
      maxX: imageDims.clientWidth,
      maxY: imageDims.clientHeight
    };
    
    // Ensure selection stays within bounds
    if (x < bounds.minX) {
      width += x;
      x = bounds.minX;
    }
    if (y < bounds.minY) {
      height += y;
      y = bounds.minY;
    }
    if (x + width > bounds.maxX) {
      width = bounds.maxX - x;
    }
    if (y + height > bounds.maxY) {
      height = bounds.maxY - y;
    }
    
    return { x, y, width, height };
  };

  const handleMouseDown = (e) => {
    const pos = getMousePosition(e);
    
    // Check if clicking on selection border (resize mode)
    const borderThreshold = 10;
    const onRightEdge = Math.abs(pos.x - (selection.x + selection.width)) < borderThreshold;
    const onBottomEdge = Math.abs(pos.y - (selection.y + selection.height)) < borderThreshold;
    const onLeftEdge = Math.abs(pos.x - selection.x) < borderThreshold;
    const onTopEdge = Math.abs(pos.y - selection.y) < borderThreshold;
    
    if (onRightEdge || onBottomEdge || onLeftEdge || onTopEdge) {
      setCropMode('resize');
      setStartPoint(pos);
      return;
    }
    
    // Check if clicking inside selection (drag mode)
    if (pos.x >= selection.x && pos.x <= selection.x + selection.width &&
        pos.y >= selection.y && pos.y <= selection.y + selection.height) {
      setCropMode('drag');
      setStartPoint({
        x: pos.x - selection.x,
        y: pos.y - selection.y
      });
      return;
    }
    
    // Otherwise, start new selection
    setCropMode('select');
    setStartPoint(pos);
    setSelection({ x: pos.x, y: pos.y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    const pos = getMousePosition(e);
    
    if (cropMode === 'select') {
      let newSelection = {
        x: Math.min(startPoint.x, pos.x),
        y: Math.min(startPoint.y, pos.y),
        width: Math.abs(pos.x - startPoint.x),
        height: Math.abs(pos.y - startPoint.y)
      };
      
      // Apply aspect ratio constraint
      if (aspectRatio && newSelection.width > 0 && newSelection.height > 0) {
        newSelection = constrainToAspectRatio(
          newSelection.x, 
          newSelection.y, 
          newSelection.width, 
          newSelection.height
        );
      }
      
      // Apply bounds constraint
      newSelection = constrainToBounds(
        newSelection.x, 
        newSelection.y, 
        newSelection.width, 
        newSelection.height
      );
      
      setSelection(newSelection);
    } else if (cropMode === 'drag') {
      let newX = pos.x - startPoint.x;
      let newY = pos.y - startPoint.y;
      
      // Keep within bounds
      newX = Math.max(0, Math.min(newX, imageDims.clientWidth - selection.width));
      newY = Math.max(0, Math.min(newY, imageDims.clientHeight - selection.height));
      
      setSelection(prev => ({ ...prev, x: newX, y: newY }));
    } else if (cropMode === 'resize') {
      // Handle resize from different edges
      const startPos = startPoint;
      let newWidth = selection.width;
      let newHeight = selection.height;
      let newX = selection.x;
      let newY = selection.y;
      
      // Simple resize from bottom-right for now
      newWidth = pos.x - selection.x;
      newHeight = newWidth / aspectRatio;
      
      // Apply bounds
      if (newX + newWidth > imageDims.clientWidth) {
        newWidth = imageDims.clientWidth - newX;
        newHeight = newWidth / aspectRatio;
      }
      if (newY + newHeight > imageDims.clientHeight) {
        newHeight = imageDims.clientHeight - newY;
        newWidth = newHeight * aspectRatio;
      }
      
      setSelection(prev => ({ ...prev, width: newWidth, height: newHeight }));
    }
  };

  const handleMouseUp = () => {
    setCropMode('');
  };

  const handleCrop = () => {
    if (selection.width < 10 || selection.height < 10) {
      alert('Selection too small. Please select a larger area.');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate crop coordinates in original image pixels
      const scaleX = img.naturalWidth / imageDims.clientWidth;
      const scaleY = img.naturalHeight / imageDims.clientHeight;
      
      const cropX = selection.x * scaleX;
      const cropY = selection.y * scaleY;
      const cropWidth = selection.width * scaleX;
      const cropHeight = selection.height * scaleY;
      
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );
      
      const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      onCropComplete(croppedImageUrl);
    };
    
    img.src = imageUrl;
  };

  const resetSelection = () => {
    if (imageDims.clientWidth > 0 && imageDims.clientHeight > 0) {
      const containerWidth = imageDims.clientWidth;
      const containerHeight = imageDims.clientHeight;
      const targetRatio = aspectRatio;
      
      let selectionWidth = containerWidth * 0.8;
      let selectionHeight = selectionWidth / targetRatio;
      
      if (selectionHeight > containerHeight * 0.8) {
        selectionHeight = containerHeight * 0.8;
        selectionWidth = selectionHeight * targetRatio;
      }
      
      const centerX = (containerWidth - selectionWidth) / 2;
      const centerY = (containerHeight - selectionHeight) / 2;
      
      setSelection({
        x: centerX,
        y: centerY,
        width: selectionWidth,
        height: selectionHeight
      });
    }
  };

  const getCursorStyle = () => {
    if (cropMode === 'drag') return 'move';
    if (cropMode === 'resize') return 'nwse-resize';
    return 'crosshair';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
          <h3 style={{margin:0}}>Crop Image</h3>
          <button 
            onClick={onCancel}
            style={{
              background:'none', border:'none', fontSize:'20px', 
              cursor:'pointer', color:'#666', padding:'5px'
            }}
          >
            ✕
          </button>
        </div>
        
        <p className="muted" style={{marginBottom:'10px'}}>
          Click and drag to select area. Drag selection to move. Drag corners to resize.
        </p>
        
        {selection.width > 0 && selection.height > 0 && (
          <div style={{fontSize:'12px', color:'#666', marginBottom:'10px'}}>
            Selection: {Math.round(selection.width)}×{Math.round(selection.height)}px | 
            Final: {Math.round(selection.width * imageDims.naturalWidth / imageDims.clientWidth)}×{Math.round(selection.height * imageDims.naturalHeight / imageDims.clientHeight)}px
          </div>
        )}
        
        <div 
          ref={containerRef}
          style={{
            position: 'relative',
            margin: '20px 0',
            textAlign: 'center',
            cursor: getCursorStyle(),
            userSelect: 'none'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img 
            ref={imgRef}
            src={imageUrl} 
            alt="Crop preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '60vh',
              border: '2px solid #ddd',
              borderRadius: '5px',
              display: 'block'
            }}
            onLoad={handleImageLoad}
          />
          
          {selection.width > 0 && selection.height > 0 && (
            <>
              {/* Selection overlay */}
              <div style={{
                position: 'absolute',
                border: '2px solid #007bff',
                backgroundColor: 'rgba(0,123,255,0.1)',
                left: selection.x,
                top: selection.y,
                width: selection.width,
                height: selection.height,
                pointerEvents: 'none'
              }} />
              
              {/* Resize handles */}
              <div
                style={{
                  position: 'absolute',
                  left: selection.x + selection.width - 8,
                  top: selection.y + selection.height - 8,
                  width: '16px',
                  height: '16px',
                  background: '#007bff',
                  border: '2px solid white',
                  borderRadius: '50%',
                  cursor: 'nwse-resize',
                  boxShadow: '0 0 0 2px #007bff'
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setCropMode('resize');
                  setStartPoint(getMousePosition(e));
                }}
              />
            </>
          )}
        </div>
        
        <div className="toolbar" style={{justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <button className="btn ghost" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn ghost" onClick={resetSelection}>
              Reset
            </button>
            {allowSkip && (
              <button
                className="btn ghost"
                onClick={() => {
                  if (onSkip) onSkip(imageUrl);
                }}
                title="Use the full image without cropping"
              >
                Use Full Image
              </button>
            )}
          </div>
          <button className="btn" onClick={handleCrop} disabled={selection.width < 50 || selection.height < 50}>
            Apply Crop
          </button>
        </div>
      </div>
      
      <canvas ref={canvasRef} style={{display:'none'}} />
    </div>
  );
};

const ImageUploader = ({ 
  label = "Upload Image", 
  aspectRatio = 16/9, 
  initialValue = "", 
  onImageSelected,
  showCrop = true,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  allowedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  autoReset = false,
  allowSkipOnUpload = false
}) => {
  const [imageUrl, setImageUrl] = useState(initialValue);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!allowedFormats.includes(file.type)) {
      alert(`Invalid format. Allowed: ${allowedFormats.map(f => f.split('/')[1]).join(', ')}`);
      return false;
    }
    
    if (file.size > maxFileSize) {
      alert(`File too large. Maximum size: ${maxFileSize / (1024 * 1024)}MB`);
      return false;
    }
    
    return true;
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file || !validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const reader = new FileReader();
    reader.onloadstart = () => {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
    };

    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setTempImageUrl(imageUrl);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        
        if (!showCrop) {
          // Skip crop and use image directly
          setImageUrl(imageUrl);
          if (onImageSelected) {
            onImageSelected(imageUrl);
          }
          if (autoReset) {
            setImageUrl('');
            setTempImageUrl('');
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }
        } else {
          setShowCropModal(true);
        }
      }, 500);
    };

    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImageUrl) => {
    setImageUrl(croppedImageUrl);
    setShowCropModal(false);
    if (onImageSelected) {
      onImageSelected(croppedImageUrl);
    }
  };

  const getAspectRatioLabel = (ratio) => {
    const commonRatios = {
      [16/9]: "16:9",
      [4/3]: "4:3", 
      [1]: "1:1",
      [3/2]: "3:2",
      [2/3]: "2:3",
      [9/16]: "9:16"
    };
    
    for (const [r, label] of Object.entries(commonRatios)) {
      if (Math.abs(ratio - parseFloat(r)) < 0.01) return label;
    }
    
    return `${Math.round(ratio * 100) / 100}:1`;
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setTempImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageSelected) {
      onImageSelected('');
    }
  };

  const handleUrlSubmit = (url) => {
    if (url.trim()) {
      setTempImageUrl(url);
      setShowCropModal(true);
    }
  };

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  return (
    <div style={{ marginBottom: '15px' }}>
      {showCropModal && (
        <ImageCropper
          imageUrl={tempImageUrl}
          aspectRatio={aspectRatio}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropModal(false);
            setTempImageUrl('');
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          allowSkip={allowSkipOnUpload}
          onSkip={() => {
            setImageUrl(tempImageUrl);
            setShowCropModal(false);
            if (onImageSelected) {
              onImageSelected(tempImageUrl);
            }
            if (autoReset) {
              setImageUrl('');
              setTempImageUrl('');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }
          }}
        />
      )}

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        {label} {aspectRatio && `(${getAspectRatioLabel(aspectRatio)})`}
      </label>

      {!imageUrl && !isUploading && (
        <div style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          cursor: 'pointer'
        }} onClick={() => fileInputRef.current?.click()}>
          <div style={{ marginBottom: '15px' }}>
            <i className="fa-solid fa-cloud-upload-alt" style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }}></i>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 5px 0' }}>
              Click to upload or drag and drop
            </p>
            <p style={{ fontSize: '12px', color: '#999', margin: '0 0 10px 0' }}>
              Standard size: {aspectRatio ? getAspectRatioLabel(aspectRatio) : 'any ratio'}
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedFormats.join(',')}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn small"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <i className="fa-solid fa-upload"></i> Choose File
            </button>
            <button 
              className="btn ghost small"
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(!showUrlInput);
              }}
            >
              <i className="fa-solid fa-link"></i> Use URL
            </button>
          </div>
          
          {showUrlInput && (
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', maxWidth: '300px', margin: '15px auto 0' }}>
              <input
                type="url"
                placeholder="Enter image URL"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                style={{ flex: 1 }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlSubmit(imageUrlInput);
                    setImageUrlInput('');
                    setShowUrlInput(false);
                  }
                }}
              />
              <button 
                className="btn small"
                onClick={() => {
                  handleUrlSubmit(imageUrlInput);
                  setImageUrlInput('');
                  setShowUrlInput(false);
                }}
              >
                Add
              </button>
            </div>
          )}
        </div>
      )}

      {isUploading && (
        <div style={{
          border: '2px dashed #007bff',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f0f8ff'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', color: '#007bff' }}></i>
          </div>
          <p style={{ fontSize: '14px', color: '#007bff', margin: '0 0 10px 0' }}>
            Processing... {uploadProgress}%
          </p>
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: '#e0e0e0',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${uploadProgress}%`,
              height: '100%',
              backgroundColor: '#007bff',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      )}

      {imageUrl && !isUploading && (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          backgroundColor: 'white'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <img 
              src={imageUrl} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px',
                borderRadius: '5px',
                border: '1px solid #eee'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              className="btn ghost small"
              onClick={handleRemoveImage}
            >
              <i className="fa-solid fa-trash"></i> Remove
            </button>
            <button 
              className="btn small"
              onClick={() => {
                setTempImageUrl(imageUrl);
                setShowCropModal(true);
              }}
            >
              <i className="fa-solid fa-crop"></i> Recrop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
