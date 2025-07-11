variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "myResourceGroup"
}

variable "location" {
  description = "Azure location"
  type        = string
  default     = "East US"
}

variable "storage_account_name" {
  description = "Unique name for the storage account (lowercase letters and numbers only)"
  type        = string
  default     = "examplestorageacct123"
}
