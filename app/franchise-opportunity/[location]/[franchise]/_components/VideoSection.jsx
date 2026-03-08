const VideoSection = ({ videoUrl }) => {
  if (!videoUrl) return null;

  return (
    <div className="md:max-w-4xl mx-4 md:mx-auto my-20">
      <div className="relative pb-[56.25%] h-0">
        <iframe
          src={videoUrl}
          className="absolute top-0 left-0 w-full h-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoSection;
