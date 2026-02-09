```mermaid
erDiagram
    User ||--o{ UserProfile : has
    User ||--o{ Node: has 
    User ||--o{ MLModel: creates
    User ||--o{ ModelTrainingInfo: trains
    Node ||--o{ Packet: contains
    MLModel ||--o{ Anomaly: detects
    MLModel ||--o{ ModelTrainingInfo: version
    ModelTrainingInfo ||--o{ ModelPredictionInfo: generates 
    User {
        int id PK
        string username
        string email
        string password
    }

    UserProfile {
        int it PK
        int user_id FK
        string role
        string organisation
        string profile_image
    }

    Node {
        int id PK
        int owner_id FK
        int node_id UK
        datetime created_at
        boolean is_active
    }

    Packet {
        int id PK
        int nodeID_id FK
        datetime time
        string mac
        int spreading_factor
        float chanel_frequency
        int transmission_power
        int bandwidth
        int coding_rate
        float snr
        float rssi
        int sequence_number
        string payload
        int payload_size
        int num_recieved_per_node
        int pdr_per_node
        int num_received_per_node_per_window
        int current_seq_num
        int last_seq_num_at_window_start
        int pdr_per_node_per_window
        float inter_arrival_time_s
        float inter_arrival_time_m
        boolean is_anomalous
        datetime created_at
    }

    MLModel {
        int id PK
        string name
        float version
        string algorithm_type
        int created_by_id FK
        datetime created_at
    }

    Anomaly {
        int id PK
        int packet_id FK
        int model_id FK
        float confidence
        datetime detected_at
    }

    ModelTrainingInfo {
        int id PK
        int model_id FK
        inte trained_by_id FK
        datetime trained_at
        string training_data_file
        int num_training_samples
        float contamination
        int n_estimators
        float accuracy
        float precision
        float recall
        float f1_score
        int anomaly_count
        float anomaly_percentage
        float silhouette_score
        boolean is_active
    }

    ModelPredictionInfo{
        int id PK
        int model_id FK
        int training_run_id FK
        datetime predicted_at
        string input_file_name
        int num_packets
        int anomalies_detected
        float anomaly_percentage
        float mean_anomaly_score
        float std_anomaly_score
        float min_anomaly_score
        float max_anomaly_score
        float accuracy_on_file
    }