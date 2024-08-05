import React, { useState, useRef, useEffect } from "react";
import styles from "./dropdown.module.scss";
import { CrossIcon } from "../../assets/Cross";
import {
  ISelectedOption,
  IDropdownProps,
  IOption,
} from "../../utils/interface";

export const SelectedOption = (props: ISelectedOption) => {
  const { option, handleUnselectOption } = props;

  return (
    <div
      className={styles.selectedOptionContainer}
      onClick={(e) => e?.stopPropagation()}
    >
      <p className={styles.selectedOptionLabel}>{option?.label}</p>
      <span
        onClick={(e) => {
          e?.stopPropagation();
          handleUnselectOption(option);
        }}
      >
        <CrossIcon />
      </span>
    </div>
  );
};

const Dropdown: React.FC<IDropdownProps> = ({
  options,
  isMulti = false,
  showFilter = false,
  filterPlaceholder = "",
  placeholder = "",
  prevValue = [],
  handleChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<IOption[]>(
    prevValue || []
  );
  const [filter, setFilter] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<IOption[]>(options);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedOptions(prevValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevValue?.toString()]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleDropdownClose = () => {
    setIsOpen(false);
    setFilter("");
    setFilteredOptions(options);
  };

  const handleOptionClick = (option: IOption) => {
    if (isMulti) {
      const updatedOptions = selectedOptions?.filter(
        (i) => i?.id !== option?.id
      );
      setSelectedOptions([...updatedOptions, option]);
      handleChange && handleChange([...updatedOptions, option]);
    } else {
      setSelectedOptions([option]);
      handleChange && handleChange([option]);
      handleDropdownClose();
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e?.target?.value);
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(e?.target?.value?.toLowerCase())
      )
    );
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      handleDropdownClose();
    }
  };

  const handleUnselectOption = (option: IOption) => {
    const updatedOptions = selectedOptions?.filter((i) => i?.id !== option?.id);
    setSelectedOptions(updatedOptions);
  };

  useEffect(() => {
    setFilteredOptions(options);
    setFilter("");
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div className={styles.dropdown}>
        <button
          className={`btn ${styles.dropdownToggle}`}
          type="button"
          onClick={toggleDropdown}
        >
          {selectedOptions?.length > 0 ? (
            isMulti ? (
              <div className={styles.selectedOptionWrapper}>
                {selectedOptions?.map((selectedOption) => (
                  <SelectedOption
                    key={selectedOption?.id}
                    option={selectedOption}
                    handleUnselectOption={handleUnselectOption}
                  />
                ))}
              </div>
            ) : (
              <p className={styles.label}>{selectedOptions?.[0]?.label}</p>
            )
          ) : (
            <p className={styles.placeholder}>{placeholder}</p>
          )}
        </button>
        {isOpen && (
          <div className={`${styles.dropdownMenu} ${styles.show}`}>
            {showFilter && (
              <input
                type="text"
                className={`form-control ${styles.filterInput}`}
                placeholder={filterPlaceholder}
                value={filter}
                autoComplete="off"
                onChange={handleFilterChange}
              />
            )}
            <div className={styles.options}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <a
                    key={option.id}
                    className={`${styles.dropdownItem} ${
                      selectedOptions.find((i) => i?.id === option?.id)
                        ? styles.active
                        : ""
                    }`}
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOptionClick(option);
                    }}
                  >
                    {option.label}
                  </a>
                ))
              ) : (
                <a
                  className={styles.dropdownItem}
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  No options found
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
