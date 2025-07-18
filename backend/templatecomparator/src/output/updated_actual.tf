provider "azurerm" {
  features {}
}

# --- Patch from PCI Compliance ---

resource "azurerm_storage_account" "pci_storage" {
  name                     = "stpcidev"
  resource_group_name      = "myResourceGroup"
  location                 = "East US"
  account_tier             = "Standard"
  account_replication_type = "GRS"
  min_tls_version          = "TLS1_2"

  blob_properties {
    delete_retention_policy {
      days = 365
    }
  }
}
