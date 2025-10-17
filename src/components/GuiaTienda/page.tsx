import ImageModal from "../ImageModal/page";

interface GuiaTiendaProps {
  title: string;
  description: string;
  image: string;
  borderColor?: string;
}

const GuiaTienda: React.FC<GuiaTiendaProps> = ({
  title,
  description,
  image,
  borderColor,
}) => {
  return (
    <div
      className={`${
        borderColor || ""
      } border rounded-lg shadow-md p-6 m-2 grid items-center justify-center text-center hover:shadow-2xl transition`}
    >
      <h2 className="font-thin text-xl">{title}</h2>
      <ImageModal image={image} title={title} nameClass={"h-60"} />
      <p className="h-auto">{description}</p>
    </div>
  );
};

export default GuiaTienda;
