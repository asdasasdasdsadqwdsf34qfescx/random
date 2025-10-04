interface VideoPlayerProps {
  src: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  showExternalLink?: boolean;
}

export const VideoPlayer = ({ 
  src, 
  title, 
  className = "", 
  style,
  showExternalLink = true 
}: VideoPlayerProps) => (
  <div className="relative group">
    <video
      controls
      className={`rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
      style={style}
      src={src}
      title={title}
    />
    {showExternalLink && (
      <button
        onClick={() => window.open(src, '_blank')}
        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
        title="Deschide în tab nou"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </button>
    )}
  </div>
);
