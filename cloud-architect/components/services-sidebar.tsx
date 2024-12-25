"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@nextui-org/react"

import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const BASE_URL = "https://raw.githubusercontent.com/Ashutosh0x/google-icons/refs/heads/main"

const categories = [
  {
    value: "ai-ml",
    label: "AI & ML",
    services: [
      { name: "AI Hub", icon: "ai_hub" },
      { name: "AI Platform", icon: "ai_platform" },
      { name: "AI Platform Unified", icon: "ai_platform_unified" },
      { name: "Advanced Agent Modeling", icon: "advanced_agent_modeling" },
      { name: "Agent Assist", icon: "agent_assist" },
      { name: "AutoML", icon: "automl" },
      { name: "AutoML Natural Language", icon: "automl_natural_language" },
      { name: "AutoML Tables", icon: "automl_tables" },
      { name: "AutoML Translation", icon: "automl_translation" },
      { name: "AutoML Video Intelligence", icon: "automl_video_intelligence" },
      { name: "AutoML Vision", icon: "automl_vision" },
      { name: "Contact Center AI", icon: "contact_center_ai" },
      { name: "Dialog Flow", icon: "dialogflow" },
      { name: "Dialog Flow CX", icon: "dialogflow_cx" },
      { name: "Document AI", icon: "document_ai" },
      { name: "Natural Language API", icon: "cloud_natural_language_api" },
      { name: "Speech to Text", icon: "speech-to-text" },
      { name: "Text to Speech", icon: "text-to-speech" },
      { name: "Translation API", icon: "cloud_translation_api" },
      { name: "Vision AI", icon: "cloud_vision_api" },
      { name: "Vertex AI", icon: "vertexai" },
    ]
  },
  {
    value: "compute",
    label: "Compute & Containers",
    services: [
      { name: "App Engine", icon: "app_engine" },
      { name: "Compute Engine", icon: "compute_engine" },
      { name: "Cloud Functions", icon: "cloud_functions" },
      { name: "Cloud Run", icon: "cloud_run" },
      { name: "Cloud Run for Anthos", icon: "cloud_run_for_anthos" },
      { name: "Container Registry", icon: "container_registry" },
      { name: "Container-Optimized OS", icon: "container_optimized_os" },
      { name: "GKE", icon: "google_kubernetes_engine" },
      { name: "GKE On-Prem", icon: "gke_on-prem" },
      { name: "GPU", icon: "cloud_gpu" },
      { name: "TPU", icon: "cloud_tpu" },
      { name: "VMware Engine", icon: "vmware_engine" },
      { name: "Bare Metal", icon: "bare_metal_solutions" },
      { name: "Batch", icon: "batch" },
    ]
  },
  {
    value: "storage",
    label: "Storage & Databases",
    services: [
      { name: "Cloud Storage", icon: "cloud_storage" },
      { name: "Cloud SQL", icon: "cloud_sql" },
      { name: "Cloud Spanner", icon: "cloud_spanner" },
      { name: "Cloud Bigtable", icon: "bigtable" },
      { name: "Firestore", icon: "firestore" },
      { name: "Filestore", icon: "filestore" },
      { name: "Persistent Disk", icon: "persistent_disk" },
      { name: "Local SSD", icon: "local_ssd" },
      { name: "Memorystore", icon: "memorystore" },
      { name: "Database Migration", icon: "database_migration_service" },
      { name: "Datastore", icon: "datastore" },
    ]
  },
  {
    value: "networking",
    label: "Networking",
    services: [
      { name: "VPC", icon: "virtual_private_cloud" },
      { name: "Cloud CDN", icon: "cloud_cdn" },
      { name: "Cloud DNS", icon: "cloud_dns" },
      { name: "Cloud Load Balancing", icon: "cloud_load_balancing" },
      { name: "Cloud NAT", icon: "cloud_nat" },
      { name: "Cloud Router", icon: "cloud_router" },
      { name: "Cloud VPN", icon: "cloud_vpn" },
      { name: "Network Intelligence", icon: "network_intelligence_center" },
      { name: "Network Security", icon: "network_security" },
      { name: "Network Connectivity Center", icon: "network_connectivity_center" },
      { name: "Network Tiers", icon: "network_tiers" },
      { name: "Traffic Director", icon: "traffic_director" },
      { name: "Cloud Interconnect", icon: "cloud_interconnect" },
      { name: "Partner Interconnect", icon: "partner_interconnect" },
    ]
  },
  {
    value: "security",
    label: "Security & Identity",
    services: [
      { name: "Cloud Armor", icon: "cloud_armor" },
      { name: "Cloud HSM", icon: "cloud_hsm" },
      { name: "Cloud KMS", icon: "key_management_service" },
      { name: "Identity Platform", icon: "identity_platform" },
      { name: "Identity-Aware Proxy", icon: "identity-aware_proxy" },
      { name: "Security Command Center", icon: "security_command_center" },
      { name: "Security Scanner", icon: "cloud_security_scanner" },
      { name: "Web Security Scanner", icon: "web_security_scanner" },
      { name: "Binary Authorization", icon: "binary_authorization" },
      { name: "Secret Manager", icon: "secret_manager" },
      { name: "Access Context Manager", icon: "access_context_manager" },
      { name: "IAM", icon: "identity_and_access_management" },
      { name: "Managed AD", icon: "managed_service_for_microsoft_active_directory" },
    ]
  },
  {
    value: "devops",
    label: "DevOps & Management",
    services: [
      { name: "Cloud Build", icon: "cloud_build" },
      { name: "Cloud Deploy", icon: "cloud_deploy" },
      { name: "Cloud Scheduler", icon: "cloud_scheduler" },
      { name: "Cloud Tasks", icon: "cloud_tasks" },
      { name: "Deployment Manager", icon: "cloud_deployment_manager" },
      { name: "Artifact Registry", icon: "artifact_registry" },
      { name: "Cloud Code", icon: "cloud_code" },
      { name: "Cloud Shell", icon: "cloud_shell" },
      { name: "Cloud Trace", icon: "trace" },
      { name: "Cloud Profiler", icon: "profiler" },
      { name: "Cloud Logging", icon: "cloud_logging" },
      { name: "Cloud Monitoring", icon: "cloud_monitoring" },
      { name: "Error Reporting", icon: "error_reporting" },
      { name: "Cloud Debugger", icon: "debugger" },
    ]
  },
  {
    value: "analytics",
    label: "Analytics & Big Data",
    services: [
      { name: "BigQuery", icon: "bigquery" },
      { name: "Cloud Composer", icon: "cloud_composer" },
      { name: "Cloud Dataflow", icon: "dataflow" },
      { name: "Cloud Dataproc", icon: "dataproc" },
      { name: "Cloud Pub/Sub", icon: "pubsub" },
      { name: "Data Catalog", icon: "data_catalog" },
      { name: "Data Fusion", icon: "cloud_data_fusion" },
      { name: "Data Loss Prevention", icon: "data_loss_prevention_api" },
      { name: "Dataprep", icon: "dataprep" },
      { name: "Dataplex", icon: "dataplex" },
      { name: "Datastream", icon: "datastream" },
      { name: "Looker", icon: "looker" },
    ]
  },
]

export function ServicesSidebar() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState(categories[0].value)
  
  const onDragStart = (event: React.DragEvent, nodeType: string, service: { name: string, icon: string }) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, service }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex h-screen w-80 flex-col border-r">
      <div className="border-b p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-wrap gap-2 p-4">
          {categories.map((category) => (
            <Button
              key={category.value}
              color="primary"
              variant={activeCategory === category.value ? "solid" : "bordered"}
              size="sm"
              onClick={() => setActiveCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="grid grid-cols-2 gap-2 p-4">
            {categories
              .find(cat => cat.value === activeCategory)?.services
              .filter(service => 
                service.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((service) => (
                <div
                  key={service.name}
                  className={cn(
                    "flex cursor-grab items-center gap-2 rounded-md border p-2",
                    "hover:bg-muted active:cursor-grabbing"
                  )}
                  draggable
                  onDragStart={(event) => onDragStart(event, 'service', service)}
                >
                  <Image
                    src={`${BASE_URL}/${service.icon}.svg`}
                    alt={service.name}
                    width={32}
                    height={32}
                    className="h-8 w-8"
                    unoptimized
                  />
                  <span className="text-sm">{service.name}</span>
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

