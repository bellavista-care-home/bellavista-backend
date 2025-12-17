import React, { useState, useRef } from 'react';

const ImageUploader = ({ 
  label = "Image", 
  onImageSelected, 
  aspectRatio = null, // e.g., 16/9 or 1 (square)
  initialValue = "",
  helperText = ""
}) => {
  const [preview, setPreview] = useState(initialValue);
  const [showEditor, setShowEditor] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImage(event.target.result);
        setShowEditor(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = (type) => {
    if (!tempImage) return;

    if (type === 'original') {
      setPreview(tempImage);
      onImageSelected(tempImage);
      setShowEditor(false);
      return;
    }

    if (type === 'crop' && aspectRatio) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate dimensions to fit aspect ratio (center crop)
        let sourceWidth = img.width;
        let sourceHeight = img.height;
        let sourceX = 0;
        let sourceY = 0;
        
        const targetRatio = aspectRatio;
        const currentRatio = sourceWidth / sourceHeight;

        if (currentRatio > targetRatio) {
          // Image is wider than target: crop width
          sourceWidth = sourceHeight * targetRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // Image is taller than target: crop height
          sourceHeight = sourceWidth / targetRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }

        // Set canvas size (you might want to cap max resolution here)
        canvas.width = sourceWidth;
        canvas.height = sourceHeight;

        // Draw
        ctx.drawImage(
          img, 
          sourceX, sourceY, sourceWidth, sourceHeight, 
          0, 0, canvas.width, canvas.height
        );

        const processedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setPreview(processedDataUrl);
        onImageSelected(processedDataUrl);
        setShowEditor(false);
      };
      img.src = tempImage;
    }
  };

  return (
    <div className="image-uploader field">
      <label>{label}</label>
      
      {/* Input Area */}
      <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
        <button 
          className="btn" 
          onClick={() => fileInputRef.current.click()}
          style={{margin:0, whiteSpace:'nowrap', width: '100%'}}
        >
          <i className="fa-solid fa-cloud-arrow-up"></i> Upload Image
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          hidden 
          onChange={handleFileChange}
        />
      </div>
      
      {/* Helper Text */}
      {helperText && <p className="muted" style={{fontSize:'12px', marginTop:'4px'}}>{helperText}</p>}

      {/* Preview */}
      {preview && (
        <div style={{marginTop:'10px', position:'relative', width:'100%', maxWidth:'300px', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden'}}>
           <img src={preview} alt="Preview" style={{width:'100%', display:'block'}} />
           <button 
             onClick={() => {setPreview(''); onImageSelected('');}}
             style={{
               position:'absolute', top:'5px', right:'5px', 
               background:'rgba(0,0,0,0.5)', color:'white', 
               border:'none', borderRadius:'50%', width:'24px', height:'24px', cursor:'pointer'
             }}
           >
             <i className="fa-solid fa-times"></i>
           </button>
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <div style={{
          position:'fixed', top:0, left:0, right:0, bottom:0, 
          background:'rgba(0,0,0,0.8)', zIndex:1000, 
          display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          <div style={{background:'white', padding:'20px', borderRadius:'12px', maxWidth:'90%', maxHeight:'90%', overflow:'auto', width:'500px'}}>
            <h3>Adjust Image</h3>
            <p className="muted" style={{marginBottom:'15px'}}>Choose how you want to use this image.</p>
            
            <div style={{background:'#f0f0f0', padding:'10px', borderRadius:'8px', marginBottom:'20px', textAlign:'center'}}>
              <img src={tempImage} alt="Original" style={{maxWidth:'100%', maxHeight:'300px'}} />
            </div>

            <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
              <button className="btn ghost" onClick={() => setShowEditor(false)}>Cancel</button>
              <button className="btn" onClick={() => processImage('original')}>Use Original</button>
              {aspectRatio && (
                <button className="btn" onClick={() => processImage('crop')}>
                  <i className="fa-solid fa-crop"></i> Auto-Crop ({aspectRatio}:1)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
