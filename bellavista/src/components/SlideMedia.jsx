import React, { useState } from 'react';
import { useSwiper } from 'swiper/react';

const SlideMedia = ({ item, folder }) => {
  const swiper = useSwiper();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!item) return null;

  const isVideo = typeof item === 'object' && item !== null && item.type === 'video';
  const rawUrl = (typeof item === 'object' && item !== null) ? item.url : item;
  const cropMode = (typeof item === 'object' && item !== null && item.cropMode) ? item.cropMode : 'uncropped';
  
  if (!rawUrl) return null;

  // Resolve source
  const src = (rawUrl.startsWith('http') || rawUrl.startsWith('/') || rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) 
    ? rawUrl 
    : `/${folder}/${rawUrl}`;

  if (isVideo) {
    // Check for YouTube URL
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = src.match(youtubeRegex);

    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      
      if (!isPlaying) {
        return (
          <div 
            className="video-thumbnail-wrapper"
            style={{
              width: '100%', 
              aspectRatio: '16/9',
              position: 'relative', 
              cursor: 'pointer',
              background: '#000'
            }}
            onClick={() => {
              setIsPlaying(true);
              if (swiper && swiper.autoplay) swiper.autoplay.stop();
            }}
          >
            <img 
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
              alt="Video Thumbnail" 
              style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8}} 
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60px',
              height: '60px',
              background: 'rgba(255,0,0,0.8)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-play" style={{color: 'white', fontSize: '24px', marginLeft: '4px'}}></i>
            </div>
          </div>
        );
      }

      return (
        <div className="swiper-no-swiping" style={{width: '100%', aspectRatio: '16/9'}}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </div>
      );
    }

    return (
      <video 
        src={src} 
        controls 
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
        onPlay={() => swiper.autoplay.stop()}
        onEnded={() => {
           swiper.slideNext();
           swiper.autoplay.start();
        }}
      />
    );
  }

  return (
    <img 
      src={src} 
      alt="Gallery Item" 
      loading="lazy" 
      style={{width: '100%', height: '100%', objectFit: cropMode === 'cropped' ? 'cover' : 'contain'}}
    />
  );
};

export default SlideMedia;
