import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  IonImg,
  IonButton,
  openURL,
  IonIcon,
  IonRow,
  IonCol,
  IonGrid,
} from '@ionic/react';
import { useImageEditorModal } from '@src/pages/components/imageEditor/ImageEditorModal';
import { useAppNotifications } from '../hooks/useAppNotifications';
import { camera, image, pencilOutline } from 'ionicons/icons';

interface ImageEditorProps {
  businessId?: string;
  imageUrl?: string;
  onUpdatedImage?: (imageUrl: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  businessId,
  imageUrl,
  onUpdatedImage,
}) => {
  const { showErrorNotification, showNotification } = useAppNotifications();

  const { open } = useImageEditorModal();

  // Function to handle image selection from gallery
  const selectImage = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });
      if (image.dataUrl) {
        open(businessId, image.dataUrl, onUpdatedImage);
      }
    } catch (error: any) {
      if (!error.message.contains('User cancelled photos app')) {
        console.error('Error selecting image:', error);
        showErrorNotification('Error selecting image. Please try again.');
      }
    }
  };

  // Function to take a photo with camera
  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      open(businessId, image.dataUrl, onUpdatedImage);
    } catch (error) {
      console.error('Error taking photo:', error);
      showErrorNotification('Error taking photo. Please try again.');
    }
  };

  const editImage = () => {
    open(businessId, imageUrl, onUpdatedImage);
  };

  return (
    <div>
      {imageUrl && <IonImg src={imageUrl} />}
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonButton
              fill='solid'
              color={'primary'}
              expand='full'
              onClick={editImage}
            >
              <IonIcon slot='start' icon={pencilOutline} />
              Edit
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton expand='full' onClick={selectImage}>
              <IonIcon slot='start' icon={image} />
              Gallery
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton expand='block' onClick={takePhoto}>
              <IonIcon slot='start' icon={camera} />
              Camera
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default ImageEditor;
