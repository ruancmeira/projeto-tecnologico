import { useState, useEffect } from "react";
import { Patient } from "@/types";
import { toast } from "@/components/ui/sonner";

const API_URL = "http://18.229.232.250:3333/v1";

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem("healthSystemToken");
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchPatients = async (skipLoadingControl = false) => {
    if (!skipLoadingControl) {
      setLoading(true);
    }
    try {
      const response = await fetch(`${API_URL}/patients`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      } else {
        toast.warning("Erro ao carregar pacientes.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
    } finally {
      if (!skipLoadingControl) {
        setLoading(false);
      }
    }
  };

  const getPatientById = async (id: number): Promise<Patient | null> => {
    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const patient = await response.json();
        return patient;
      } else if (response.status === 404) {
        toast.warning("Paciente não encontrado.");
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      } else {
        toast.warning("Erro ao carregar paciente.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
    }
    return null;
  };

  const createPatient = async (patientData: {
    name: string;
    cpf: string;
    birthDate: string;
    phone: string;
    email: string;
    address: string;
  }): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(patientData),
      });

      if (response.ok) {
        toast.success("Paciente cadastrado com sucesso!");
        await fetchPatients(true);
        setLoading(false);
        return true;
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
          if (Array.isArray(errorData.message)) {
            toast.warning("Dados inválidos: " + errorData.message.join(", "));
          } else {
            toast.warning(errorData.message);
          }
        } else {
          toast.warning("Dados inválidos ou CPF/email já existe.");
        }
        setLoading(false);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao cadastrar paciente.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return false;
  };

  const updatePatient = async (
    id: number,
    patientData: {
      name?: string;
      cpf?: string;
      birthDate?: string;
      phone?: string;
      email?: string;
      address?: string;
    }
  ): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(patientData),
      });

      if (response.ok) {
        toast.success("Paciente atualizado com sucesso!");
        await fetchPatients(true);
        setLoading(false);
        return true;
      } else if (response.status === 404) {
        toast.warning("Paciente não encontrado.");
        setLoading(false);
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
          if (Array.isArray(errorData.message)) {
            toast.warning("Dados inválidos: " + errorData.message.join(", "));
          } else {
            toast.warning(errorData.message);
          }
        } else {
          toast.warning("Dados inválidos ou CPF/email já existe.");
        }
        setLoading(false);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao atualizar paciente.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return false;
  };

  const deletePatient = async (
    id: number,
    patientName: string
  ): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast.success("Paciente removido com sucesso!");
        await fetchPatients(true);
        setLoading(false);
        return true;
      } else if (response.status === 404) {
        toast.warning("Paciente não encontrado.");
        setLoading(false);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao remover paciente.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return false;
  };

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchPatients();
    }
  }, []);

  return {
    patients,
    loading,
    fetchPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
  };
};
