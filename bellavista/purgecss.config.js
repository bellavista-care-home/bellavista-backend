module.exports = {
  content: ['index.html', 'src/**/*.jsx', 'src/**/*.html'],
  css: ['src/**/*.css'],
  output: 'cleaned-css',
  rejected: true,
  variables: true,
  keyframes: true,
  safelist: [
    'active',
    'open',
    'visible',
    'hidden',
    'indicator-dot',
    'image-indicators',
    'read-more-btn',
    'hero',
    /^home-/, 
    /^news-/, 
    /^btn-/, 
    'modal-overlay',
    'modal-content',
    'modal-open'
  ]
};
