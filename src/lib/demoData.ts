
const STORAGE_KEY = 'dermacare_demo_data';

const getStorageData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Initial demo data
      const initialData = {
        patients: [
          { 
            id: '1', 
            name: 'Sarah Johnson', 
            phone: '1234567890', 
            age: 28, 
            gender: 'female', 
            address: '123 Skin Care Lane, Beverly Hills',
            medicalHistory: 'Mild eczema, allergic to peanuts',
            last_visit: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString() 
          },
          { 
            id: '2', 
            name: 'Michael Brown', 
            phone: '9876543210', 
            age: 35, 
            gender: 'male', 
            address: '456 Aesthetic Blvd, Los Angeles',
            medicalHistory: 'No significant history',
            last_visit: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString() 
          }
        ],
        consultations: [
          { id: '1', patient_id: '1', date: new Date().toISOString(), notes: 'Initial consultation. Patient reports mild skin irritation.', diagnosis: 'Contact Dermatitis', treatment: 'Topical steroid cream', created_at: new Date().toISOString() }
        ],
        medical_files: [],
        files: {}
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading from local storage', e);
    return { patients: [], consultations: [], medical_files: [], files: {} };
  }
};

const setStorageData = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error writing to local storage', e);
  }
};

const mockSupabase = {
  from: (table: string) => {
    const builder = {
      select: (columns: string = '*') => {
        const selectBuilder = {
          eq: (field: string, value: any) => {
            const eqBuilder = {
              single: async () => {
                const data = getStorageData();
                const item = (data[table] || []).find((i: any) => i[field] === value);
                return { data: item || null, error: item ? null : { code: 'PGRST116', message: 'Not found' } };
              },
              order: (field2: string, { ascending = true } = {}) => {
                return Promise.resolve().then(() => {
                  const data = getStorageData();
                  let items = (data[table] || []).filter((i: any) => i[field] === value);
                  items.sort((a: any, b: any) => {
                    if (ascending) return a[field2] > b[field2] ? 1 : -1;
                    return a[field2] < b[field2] ? 1 : -1;
                  });
                  return { data: items, error: null };
                });
              },
              then: (resolve: any) => {
                const data = getStorageData();
                const items = (data[table] || []).filter((i: any) => i[field] === value);
                return Promise.resolve({ data: items, error: null }).then(resolve);
              }
            };
            return eqBuilder;
          },
          order: (field: string, { ascending = true } = {}) => {
            return Promise.resolve().then(() => {
              const data = getStorageData();
              let items = [...(data[table] || [])];
              items.sort((a: any, b: any) => {
                if (ascending) return a[field] > b[field] ? 1 : -1;
                return a[field] < b[field] ? 1 : -1;
              });
              return { data: items, error: null };
            });
          },
          then: (resolve: any) => {
            const data = getStorageData();
            return Promise.resolve({ data: data[table] || [], error: null }).then(resolve);
          }
        };
        return selectBuilder;
      },
      insert: async (newData: any) => {
        const data = getStorageData();
        const items = Array.isArray(newData) ? newData : [newData];
        const newItems = items.map(item => ({
          ...item,
          id: item.id || Math.random().toString(36).substr(2, 9),
          created_at: item.created_at || new Date().toISOString()
        }));
        data[table] = [...(data[table] || []), ...newItems];
        setStorageData(data);
        return { data: Array.isArray(newData) ? newItems : newItems[0], error: null };
      },
      update: (updateData: any) => {
        return {
          eq: async (field: string, value: any) => {
            const data = getStorageData();
            data[table] = (data[table] || []).map((item: any) => 
              item[field] === value ? { ...item, ...updateData } : item
            );
            setStorageData(data);
            return { error: null };
          }
        };
      }
    };
    return builder;
  },
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const data = getStorageData();
            if (!data.files) data.files = {};
            data.files[path] = reader.result;
            setStorageData(data);
            resolve({ data: { path }, error: null });
          };
          reader.readAsDataURL(file);
        });
      },
      getPublicUrl: (path: string) => {
        const data = getStorageData();
        return { data: { publicUrl: data.files?.[path] || '' } };
      }
    })
  }
};

export default mockSupabase;
