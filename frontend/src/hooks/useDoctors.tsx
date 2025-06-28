import { useState, useEffect } from "react";
import { Doctor } from "@/types";
import { toast } from "@/components/ui/sonner";

const API_URL = "http://127.0.0.1:3333/v1";

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
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

  const fetchDoctors = async (skipLoadingControl = false) => {
    if (!skipLoadingControl) {
      setLoading(true);
    }
    try {
      const response = await fetch(`${API_URL}/doctors`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      } else {
        toast.warning("Erro ao carregar médicos.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
    } finally {
      if (!skipLoadingControl) {
        setLoading(false);
      }
    }
  };

  const getDoctorById = async (id: number): Promise<Doctor | null> => {
    try {
      const response = await fetch(`${API_URL}/doctors/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const doctor = await response.json();
        return doctor;
      } else if (response.status === 404) {
        toast.warning("Médico não encontrado.");
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      } else {
        toast.warning("Erro ao carregar médico.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
    }
    return null;
  };

  const createDoctor = async (doctorData: {
    name: string;
    cpf: string;
    specialty: string;
    crm: string;
    address: string;
  }): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(`${API_URL}/doctors`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(doctorData),
      });

      if (response.ok) {
        toast.success("Médico cadastrado com sucesso!");
        await fetchDoctors(true);
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
          toast.warning("Dados inválidos ou CRM/CPF já existe.");
        }
        setLoading(false);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao cadastrar médico.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return false;
  };

  const updateDoctor = async (
    id: number,
    doctorData: {
      name?: string;
      cpf?: string;
      specialty?: string;
      crm?: string;
      address?: string;
    }
  ): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(`${API_URL}/doctors/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(doctorData),
      });

      if (response.ok) {
        toast.success("Médico atualizado com sucesso!");
        await fetchDoctors(true);
        setLoading(false);
        return true;
      } else if (response.status === 404) {
        toast.warning("Médico não encontrado.");
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
          toast.warning("Dados inválidos ou CRM/CPF já existe.");
        }
        setLoading(false);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao atualizar médico.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return false;
  };

  const deleteDoctor = async (
    id: number,
    doctorName: string
  ): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(`${API_URL}/doctors/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast.success("Médico removido com sucesso!");
        await fetchDoctors(true);
        setLoading(false);
        return true;
      } else if (response.status === 404) {
        toast.warning("Médico não encontrado.");
        setLoading(false);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao remover médico.");
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
      fetchDoctors();
    }
  }, []);

  return {
    doctors,
    loading,
    fetchDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
  };
};
