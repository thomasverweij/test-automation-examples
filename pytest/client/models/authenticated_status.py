from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="AuthenticatedStatus")


@_attrs_define
class AuthenticatedStatus:
    """
    Attributes:
        authenticated (bool):  Example: True.
        user_id (str):  Example: user1.
        name (str):  Example: User One.
    """

    authenticated: bool
    user_id: str
    name: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        authenticated = self.authenticated

        user_id = self.user_id

        name = self.name

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "authenticated": authenticated,
                "userId": user_id,
                "name": name,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        authenticated = d.pop("authenticated")

        user_id = d.pop("userId")

        name = d.pop("name")

        authenticated_status = cls(
            authenticated=authenticated,
            user_id=user_id,
            name=name,
        )

        authenticated_status.additional_properties = d
        return authenticated_status

    @property
    def additional_keys(self) -> list[str]:
        return list(self.additional_properties.keys())

    def __getitem__(self, key: str) -> Any:
        return self.additional_properties[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.additional_properties[key] = value

    def __delitem__(self, key: str) -> None:
        del self.additional_properties[key]

    def __contains__(self, key: str) -> bool:
        return key in self.additional_properties
