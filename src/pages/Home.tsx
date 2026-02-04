// Función para asignar color según el estado
const getStatusColor = (status: string): string => {
  if (typeof status !== 'string') return 'medium';
  const normalized = status.trim().toUpperCase();
  if (normalized === 'ALIVE') return 'success';
  if (normalized === 'DEAD') return 'danger';
  return 'medium';
};
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonLoading,
  IonText
} from '@ionic/react';

// Interfaz TypeScript para el personaje de Futurama
interface FuturamaCharacter {
  id: number;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | string;
  species?: string;
  age?: string;
  homePlanet?: string;
  occupation?: string;
  sayings?: string[];
  image?: string;
  status: 'ALIVE' | 'DEAD' | 'UNKNOWN' | string;
}

const Home: React.FC = () => {
  // Estado para los personajes
  const [characters, setCharacters] = useState<FuturamaCharacter[]>([]);
  // Estado de carga
  const [loading, setLoading] = useState<boolean>(true);
  // Estado de error
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get('https://futuramaapi.com/api/characters?orderBy=id&orderByDirection=asc&page=1&size=50')
      .then(response => {
        setCharacters(response.data.items || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar los personajes. Intenta nuevamente.');
        setLoading(false);
      });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Personajes Futurama</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading isOpen={loading} message="Cargando personajes..." />

        {error && (
          <IonItem color="danger">
            <IonLabel color="danger">{error}</IonLabel>
          </IonItem>
        )}

        {!loading && !error && characters.length === 0 && (
          <IonItem>
            <IonLabel>No hay personajes para mostrar.</IonLabel>
          </IonItem>
        )}

        {!loading && !error && characters.length > 0 && (
          <IonList>
            {characters.map((character: FuturamaCharacter) => {
              const imageUrl = character.image && character.image.startsWith('http')
                ? character.image
                : undefined;

              return (
                <IonItem key={character.id}>
                  <IonAvatar slot="start" style={{ width: 64, height: 64 }}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ fontSize: 24, textAlign: 'center', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {character.name
                          .split(' ')
                          .map((word: string) => word[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                    )}
                  </IonAvatar>
                  <IonLabel>
                    <h2>{character.name}</h2>
                    <p>Género: <IonText color="medium">{character.gender}</IonText></p>
                    <p>
                      Estado: <IonText color={getStatusColor(character.status)} style={{ fontWeight: 'bold' }}>{character.status}</IonText>
                    </p>
                  </IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;